using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public static class ZipTask
    {
        public static async System.Threading.Tasks.Task ExecuteZipArchive(ImageDownloadTask taskDetail, CancellationToken token, IProgress<int> progress)
        {
            if (token.IsCancellationRequested)
            {
                if (progress != null)
                    progress.Report(100);
                token.ThrowIfCancellationRequested();
            }

            var objReturn = new
            {
                createdArchiveFiles = new List<ArchiveResponse>()
            };

            using (var archiveMemoryStream = new MemoryStream())
            {
                var archive = new ZipArchive(archiveMemoryStream, ZipArchiveMode.Create, true);

                var imageList = taskDetail.ImageList;

                var db = new PortalDbContext();

                var objLocker = new object();

                long totalByteCount = 0L;

                var archiveName = $"{taskDetail.ArchiveBaseName}_001.zip";

                var archivePath = $"{taskDetail.ProgrammaticFolderPath}{archiveName}";

                var archiveLimit = Int32.MaxValue;

                for (var i = 0; i < imageList.Count; i++)
                {
                    var image = imageList[i];

                    var imagePath = $"\\\\vm-web\\D$\\wwwroot\\flock\\imagelibrary\\1024\\{image}.jpeg";

                    var imageName = $"{image}.jpeg";

                    // Load image fileInfo
                    var info = new FileInfo(imagePath);

                    // Check that the current byte count in archive is < limit
                    if ((totalByteCount + info.Length) < archiveLimit)
                    {
                        totalByteCount += info.Length;

                        var thisImage = archive.CreateEntry(imageName);

                        using (var entryStream = thisImage.Open())
                        {
                            using (var readStream = File.OpenRead(imagePath))
                            {
                                readStream.CopyTo(entryStream);
                            }
                        }

                        // if this is the last image, we need to save the archive
                        if (image == imageList.Last())
                        {
                            archive.Dispose();

                            using (var archiveFileStream = new FileStream(archivePath, FileMode.Create))
                            {
                                archiveMemoryStream.Seek(0, SeekOrigin.Begin);
                                archiveMemoryStream.CopyTo(archiveFileStream);
                            }

                            // if we haven't already added the archive to the response list, do so now
                            if (objReturn.createdArchiveFiles.SingleOrDefault(a => a.FileName == archiveName) == null)
                            {
                                objReturn.createdArchiveFiles.Add(new ArchiveResponse(archiveName, $"{((((decimal)totalByteCount / 1024 / 1024) * 100) / 100):N0} MB"));
                            }
                        }
                    }
                    else
                    {
                        archive.Dispose();

                        using (var archiveFileStream = new FileStream(archivePath, FileMode.Create))
                        {
                            archiveMemoryStream.Seek(0, SeekOrigin.Begin);
                            archiveMemoryStream.CopyTo(archiveFileStream);
                        }

                        // Record its existence: name and size
                        objReturn.createdArchiveFiles.Add(new ArchiveResponse(archiveName, $"{((((decimal)totalByteCount / 1024 / 1024) * 100) / 100):N0} MB"));

                        // This is necessary because we want to inform the client of archives as they're created
                        taskDetail.CreatedArchiveFiles = objReturn.createdArchiveFiles;

                        if (image == imageList.Last())
                        {
                            if (progress != null)
                                progress.Report(100);

                            break;
                        }

                        archiveMemoryStream.SetLength(0);

                        // New Archive
                        archive = new ZipArchive(archiveMemoryStream, ZipArchiveMode.Create, true);

                        // Increment name
                        archiveName = $"{taskDetail.ArchiveBaseName}_{objReturn.createdArchiveFiles.Count() + 1:D3}.zip";

                        // Update the archivePath variable with the new name
                        archivePath = $"{taskDetail.ProgrammaticFolderPath}{archiveName}";

                        // Reset total byte count
                        totalByteCount = 0;

                        // Add current image size to total byte count
                        totalByteCount += info.Length;

                        // Copy this image into the newly created archive object
                        var thisImage = archive.CreateEntry(imageName);

                        using (var entryStream = thisImage.Open())
                        {
                            using (var readStream = File.OpenRead(imagePath))
                            {
                                readStream.CopyTo(entryStream);
                            }
                        }
                    }

                    if (progress != null)
                    {
                        if (image == imageList.Last())
                        {
                            progress.Report(100);
                        }
                        else
                        {
                            progress.Report(i * 100 / imageList.Count);
                        }
                    }
                }
            }

            taskDetail.CreatedArchiveFiles = objReturn.createdArchiveFiles;

            if (progress != null)
                progress.Report(100);
        }
    }
}
