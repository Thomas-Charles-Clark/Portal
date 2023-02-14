using DG_Asset_Downloader.Classes;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DG_Asset_Downloader.ViewModels
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        public MainWindowViewModel()
        {
            _pauseTokenSource = new PauseTokenSource();

            _downloadControlsEnabled = false;

            _labelText = "Please select a destination folder to download to.";

            _queue = new ObservableCollection<DownloaderListItem>();

            foreach(var i in  BasketContents.DownloadList)
            {
                _queue.Add(new DownloaderListItem(i)
                {
                    
                });
            }
        }

        private PauseTokenSource _pauseTokenSource;

        public PauseTokenSource PauseTokenSource
        {
            get
            {
                return _pauseTokenSource;
            }
        }

        private decimal _overallProgress;

        public Decimal OverallProgress
        {
            get
            {
                return _overallProgress;
            }
            set
            {
                if(value != _overallProgress)
                {
                    _overallProgress = value;
                    NotifyPropertyChanged("OverallProgress");
                }
            }
        }

        private bool _downloadControlsEnabled;

        public bool DownloadControlsEnabled
        {
            get
            {
                return _downloadControlsEnabled;
            }
            set
            {
                if(value != _downloadControlsEnabled)
                {
                    _downloadControlsEnabled = value;
                    NotifyPropertyChanged("DownloadControlsEnabled");
                }
            }
        }

        private string _downloadPath;

        public string DownloadPath
        {
            get
            {
                return _downloadPath;
            }
            set
            {
                if(value != _downloadPath)
                {
                    _downloadPath = value;
                }
            }
        }
        
        private string _labelText;

        public string LabelText
        {
            get
            {
                return _labelText;
            }
            set
            {
                if (value != _labelText)
                {
                    _labelText = value;
                    NotifyPropertyChanged("LabelText");
                }
            }
        }
        
        private ObservableCollection<DownloaderListItem> _queue;

        public ObservableCollection<DownloaderListItem> Queue
        {
            get
            {
                if (_queue == null)
                {
                    _queue = new ObservableCollection<DownloaderListItem>();
                }
                return _queue;
            }
            set
            {
                if (value != _queue)
                {
                    _queue = value;
                    NotifyPropertyChanged("Queue");
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
 
        protected void NotifyPropertyChanged(String info)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(info));
            }
        }
    }
}
