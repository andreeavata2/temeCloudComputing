import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};
interface IAppState {
  selectedPlace: {
    name: any;
  };
  showingInfoWindow: boolean;
  activeMarker: any;
}

export interface IAppProps {
  google: any;
}

class ViewMap extends React.Component<IAppProps, IAppState> {
  state = {
    showingInfoWindow: false, //Hides or the shows the infoWindow
    activeMarker: {}, //Shows the active marker upon click
    selectedPlace: {
      name: ''
    } //Shows the infoWindow to the selected place upon a marker
  };

  onMarkerClick = (props: any, marker: any, e: any) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = (props: any) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  public render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{ lat: 47.1585, lng: 27.6014 }}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Infinite Loop App - Sediu Central'}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper((props: any) => ({
  apiKey: 'AIzaSyAl-J-hv2i4zmTjA2ElLjkaKTkH3L_91h8'
}))(ViewMap);
