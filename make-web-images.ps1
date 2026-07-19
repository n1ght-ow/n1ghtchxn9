# make-web-images.ps1
# Generate web-display copies of every photo in /photos:
#   {name}-display.jpg  (long edge 2000px)  -> used by the lightbox
#   {name}-thumb.jpg    (long edge 1400px)  -> used by the gallery cards
#   {name}-small.jpg    (long edge  800px)  -> phones and smaller cards
# The originals stay untouched and are only loaded on "查看原图".
#
# Zero external dependencies: uses .NET GDI+, built into Windows PowerShell 5.1.
#
# Usage (from the project root):
#   powershell -ExecutionPolicy Bypass -File make-web-images.ps1
#   powershell -ExecutionPolicy Bypass -File make-web-images.ps1 -Force   # re-do everything

param(
  [string]$Source  = "photos",
  [string]$Out     = "photos/web",
  [int]   $Display = 2000,
  [int]   $Thumb   = 1400,
  [int]   $Small   = 800,
  [int]   $Quality = 85,
  [switch]$Force
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$srcDir = (Resolve-Path $Source).Path
$outDir = Join-Path (Get-Location).Path $Out
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# JPEG encoder + quality setting
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

function Save-Resized($srcPath, $destPath, $maxEdge) {
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

$photos = Get-ChildItem -Path $srcDir -File |
          Where-Object { $_.Extension -match '\.(jpe?g|png)$' }

$made = 0; $skipped = 0
foreach ($p in $photos) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($p.Name)
  $targets = @(
    @{ path = (Join-Path $outDir "$base-display.jpg"); edge = $Display },
    @{ path = (Join-Path $outDir "$base-thumb.jpg");   edge = $Thumb   },
    @{ path = (Join-Path $outDir "$base-small.jpg");   edge = $Small   }
  )
  foreach ($t in $targets) {
    if ((Test-Path $t.path) -and -not $Force) { $skipped++; continue }
    Save-Resized $p.FullName $t.path $t.edge
    Write-Host ("  + " + (Split-Path $t.path -Leaf))
    $made++
  }
}

Write-Host ""
Write-Host "Done. Generated $made file(s), skipped $skipped existing."
if ($skipped -and -not $Force) { Write-Host "Run with -Force to regenerate everything." }
