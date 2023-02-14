using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace DG_Asset_Downloader.Classes
{
    public class DownloaderListItem : INotifyPropertyChanging, INotifyPropertyChanged
    {
        public DownloaderListItem() { }

        public DownloaderListItem(long id)
        {
            _imageId = id;
            _CurrentProgress = 0;
            _Processed = false;
            _ProcessState = new ProcessState() { StateColour = Brushes.Orange };
        }

        private long _imageId;

        public long ImageID
        {
            get
            {
                return _imageId;
            }
        }
        
        private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);

        private int _CurrentProgress;

        public int CurrentProgress
        {
            get
            {
                return this._CurrentProgress;
            }
            set
            {
                if (this._CurrentProgress != value)
                {
                    this.SendPropertyChanging();
                    this._CurrentProgress = value;
                    this.SendPropertyChanged("CurrentProgress");
                }
            }
        }

        private bool _Processed;

        public bool Processed
        {
            get
            {
                return _Processed;
            }
            set
            {
                if (this._Processed != value)
                {
                    this.SendPropertyChanging();
                    this._Processed = value;
                    this.SendPropertyChanged("Processed");
                }
            }
        }

        private ProcessState _ProcessState;

        public ProcessState ProcessState
        {
            get
            {
                return this._ProcessState;
            }
            set
            {
                if (this._ProcessState != value)
                {
                    this.SendPropertyChanging();
                    this._ProcessState = value;
                    this.SendPropertyChanged("ProcessState");
                }
            }
        }


        public event PropertyChangingEventHandler PropertyChanging;

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void SendPropertyChanging()
        {
            if ((this.PropertyChanging != null))
            {
                this.PropertyChanging(this, emptyChangingEventArgs);
            }
        }

        protected virtual void SendPropertyChanged(String propertyName)
        {
            if ((this.PropertyChanged != null))
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}
