using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Forms;
using DG_Asset_Downloader.ViewModels;
using DG_Asset_Downloader.Classes;
using System.Net;
using System.ComponentModel;

namespace DG_Asset_Downloader
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// 
    /// Need to determine required disk space and inform user, prevent selection of folder if insufficient
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            WriteToLogFile("DG Downloader Started");
            InitializeComponent();
        }

        private void FolderSelectBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var dialog = new FolderBrowserDialog();

                DialogResult result = dialog.ShowDialog();

                if (result == System.Windows.Forms.DialogResult.OK)
                {
                    string pathRoot = System.IO.Path.GetPathRoot(dialog.SelectedPath);
                    if (pathRoot == null)
                    {
                        // show error dialog!
                    }
                    else
                    {
                        System.IO.DriveInfo di = new System.IO.DriveInfo(pathRoot);
                        if (di.AvailableFreeSpace < BasketContents.RequiredDiskSpaceInBytes + Helper.FiveMiB) // ensure 5MiB free space above required to avoid... bad things
                        {
                            // show free space warning dialog!
                        }
                        else
                        {
                            var viewModel = this.DataContext as MainWindowViewModel;
                            viewModel.DownloadPath = dialog.SelectedPath;
                            viewModel.LabelText = dialog.SelectedPath;
                            viewModel.DownloadControlsEnabled = true;

                            foreach (var item in viewModel.Queue)
                            {
                                item.CurrentProgress = 0;
                                item.Processed = false;
                                item.ProcessState.StateColour = Brushes.LightSkyBlue;
                            }

                            viewModel.OverallProgress = 0;

                            DownloadBtn.Content = "Start Download";
                            DownloadBtn.Click -= DownloadBtn_Click;
                            DownloadBtn.Click -= PauseButton_Click;
                            DownloadBtn.Click -= ResumeButton_Click;
                            DownloadBtn.Click += DownloadBtn_Click;
                            DownloadBtn.IsEnabled = true;

                        }
                    }
                }
            }
            catch(Exception ex)
            {
                WriteToLogFile(ex.ToString());
                this.Close();
            }
        }

        private async void DownloadBtn_Click(object sender, RoutedEventArgs e)
        {
            ProgressBarTextBlock.Foreground = Brushes.Black;

            var button = sender as System.Windows.Controls.Button;

            button.Click -= DownloadBtn_Click;
            button.Click += PauseButton_Click;
            button.Content = "Pause Download";

            await this.Dispatcher.InvokeAsync(() => DownloadOperation());
        }

        private void PauseButton_Click(object sender, RoutedEventArgs e)
        {
            var viewModel = this.DataContext as MainWindowViewModel;
            viewModel.PauseTokenSource.IsPaused = true;

            var button = sender as System.Windows.Controls.Button;
            button.Click -= PauseButton_Click;
            button.Click += ResumeButton_Click;
            button.Content = "Resume Download";
        }

        private void ResumeButton_Click(object sender, RoutedEventArgs e)
        {
            var viewModel = this.DataContext as MainWindowViewModel;
            viewModel.PauseTokenSource.IsPaused = false;

            var button = sender as System.Windows.Controls.Button;
            button.Click -= ResumeButton_Click;
            button.Click += PauseButton_Click;
            button.Content = "Pause Download";
        }

        async Task DownloadOperation()
        {
            try
            {

                var viewModel = this.DataContext as MainWindowViewModel;

                var count = viewModel.Queue.Count;

                decimal delta = (1M / (decimal)count) * 100.0M;

                // Cannot effectively pause a parallel.foreach loop. Threads cannot access 
                // this.DataContext without calling Dispatcher.Invoke, which performs actions on the dispatcher thread,
                // not the current loop iteration's thread.

                //Parallel.ForEach(viewModel.Queue.Where(p => p.Processed == false),
                //    new ParallelOptions { MaxDegreeOfParallelism = 2 },
                //    async (item, state) =>
                //{
                foreach (var item in viewModel.Queue.Where(p => p.Processed == false).OrderBy(p => p.ImageID))
                {
                    try
                    {
                        await Task.Delay(100);
                        // argh bloody hell why is the displayed list now out of sync with the overall progess...
                        // because we cast the delta to int? nooo... it's still a decimal...

                        //this.Dispatcher.Invoke(() => {
                        //   ((MainWindowViewModel)this.DataContext).PauseTokenSource.WaitWhilePausedAsync();
                        //});

                        await viewModel.PauseTokenSource.WaitWhilePausedAsync();

                        string uri = String.Format("http://downloads.designersguild.com/content/images/1024/{0}.jpeg", item.ImageID);
                        string targetName = String.Format("{0}\\{1}.jpg", viewModel.DownloadPath, item.ImageID);

                        WebClient wc = new WebClient();

                        wc.DownloadProgressChanged += (sender, e) => Wc_DownloadProgressChanged(sender, e, item);
                        wc.DownloadFileCompleted += (sender, e) => Wc_DownloadCompleted(sender, e, item, viewModel, delta);
                        wc.DownloadFileAsync(new Uri(uri), targetName);
                    }
                    catch (WebException wex)
                    {
                        // Houston, we have a web problem...
                        WriteToLogFile(wex.ToString());
                        break;
                    }
                }
            }
            catch(Exception ex)
            {
                WriteToLogFile(ex.ToString());
                this.Close();
            }
        }

        private void Wc_DownloadProgressChanged(object sender, DownloadProgressChangedEventArgs e, DownloaderListItem item)
        {
            item.CurrentProgress = e.ProgressPercentage;
        }
        private void Wc_DownloadCompleted(object sender, AsyncCompletedEventArgs e, DownloaderListItem item, MainWindowViewModel viewModel, decimal delta)
        {
            item.CurrentProgress = 100;
            item.ProcessState.StateColour = Brushes.Chartreuse;
            item.Processed = true;
            viewModel.OverallProgress += delta;

            if (viewModel.Queue.Where(p => p.Processed == false).Count() == 0)
                DownloadFinished();
        }

        private void DownloadFinished()
        {
            DownloadBtn.Content = "Download Complete";
            DownloadBtn.IsEnabled = false;
        }

        private void DetailExpander_Expanded(object sender, RoutedEventArgs e)
        {
            ((Expander)sender).Header = "Click to hide details";
        }

        private void DetailExpander_Collapsed(object sender, RoutedEventArgs e)
        {
            ((Expander)sender).Header = "Click to show details";
        }

        private void WriteToLogFile(string message)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(message);

            System.IO.File.AppendAllText(String.Format("dg_downloader_log_{0}.txt", DateTime.Now.ToString("dd-MM-yyyy")), sb.ToString());
        }
    }
}
