using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Linq;
using System.Windows.Media;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DG_Asset_Downloader.Classes
{
    public partial class ProcessState : INotifyPropertyChanging, INotifyPropertyChanged
    {
        partial void OnLoaded();
        partial void OnValidate(ChangeAction action);
        partial void OnCreated();
        private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);

        public ProcessState() {
            _StateColour = Brushes.Orange;
        }

        public ProcessState(Brush brush)
        {
            _StateColour = brush;
        }

        private Brush _StateColour;

        public Brush StateColour
        {
            get
            {
                if (_StateColour == null)
                    _StateColour = Brushes.Red;
                return _StateColour;
            }
            set
            {
                if (this._StateColour != value)
                {
                    this.OnStateColourChanging(value);
                    this.SendPropertyChanging();
                    this._StateColour = value;
                    this.SendPropertyChanged("StateColour");
                    this.OnStateColourChanged();
                }
            }
        }

        partial void OnStateColourChanging(Brush value);
        partial void OnStateColourChanged();

        public event PropertyChangingEventHandler PropertyChanging;

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void SendPropertyChanging()
        {
            if (this.PropertyChanging != null)
            {
                this.PropertyChanging(this, emptyChangingEventArgs);
            }
        }

        protected virtual void SendPropertyChanged(String propertyName)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}
