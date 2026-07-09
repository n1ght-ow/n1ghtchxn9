# make-cover-images.ps1
# One-off: turn the raw game covers in photos/_cover_src into web-optimized
# JPEGs in photos/covers (long edge 1600px, quality 85).
# Uses built-in .NET GDI+ for jpg/png; falls back to WIC for webp.
#
# Usage (from project root):
#   powershell -ExecutionPolicy Bypass -File make-cover-images.ps1

param(
  [string]$Source  = "photos/_cover_src",
  [string]$Out     = "photos/covers",
  [int]   $MaxEdge = 1600,
  [int]   $Quality = 85
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$srcDir = (Resolve-Path $Source).Path
$outDir = Join-Path (Get-Location).Path $Out
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

function Save-ResizedGDI($srcPath, $destPath, $maxEdge) {
  $img = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width  * $scale)
    $h = [int][Math]::Round($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, 0, 0, $w, $h)
      $g.Dispose()
      $bmp.Save($destPath, $codec, $encParams)
    } finally { $bmp.Dispose() }
  } finally { $img.Dispose() }
}

function Save-ResizedWIC($srcPath, $destPath, $maxEdge, $quality) {
  Add-Type -AssemblyName PresentationCore
  Add-Type -AssemblyName WindowsBase
  $uri = New-Object System.Uri($srcPath)
  $decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create(
    $uri,
    [System.Windows.Media.Imaging.BitmapCreateOptions]::None,
    [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
  $frame = $decoder.Frames[0]
  $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($frame.PixelWidth, $frame.PixelHeight))
  $st = New-Object System.Windows.Media.ScaleTransform($scale, $scale)
  $tb = New-Object System.Windows.Media.Imaging.TransformedBitmap($frame, $st)
  $enc = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
  $enc.QualityLevel = $quality
  $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($tb))
  $fs = [System.IO.File]::Open($destPath, [System.IO.FileMode]::Create)
  try { $enc.Save($fs) } finally { $fs.Close() }
}

$files = Get-ChildItem -Path $srcDir -File |
         Where-Object { $_.Extension -match '\.(jpe?g|png|webp)$' }

foreach ($f in $files) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
  $dest = Join-Path $outDir "$base.jpg"
  try {
    Save-ResizedGDI $f.FullName $dest $MaxEdge
    Write-Host ("  + $base.jpg  (gdi)")
  } catch {
    try {
      Save-ResizedWIC $f.FullName $dest $MaxEdge $Quality
      Write-Host ("  + $base.jpg  (wic)")
    } catch {
      Write-Host ("  ! could not convert $($f.Name): " + $_.Exception.Message)
    }
  }
}

Write-Host ""
Write-Host "Done."
