import React, { Component }from 'react';
import './App.css';
import Cards from '../Cards/Cards';
// import Fetcher from '../Fetcher/Fetcher';

class App extends Component {
  constructor() {
    super();
    this.state = {
      vehicles: [],
      people: [],
      planets: [],
      crawl: '',
      isLoading: true
    }
  }

  componentDidMount() {
    fetch('https://swapi.co/api/people/')
      .then(response => response.json())
      .then(data => this.fetchPeople(data.results))
      .then(data => this.fetchSpecies(data))
      .then(people => this.setState({ people: people, isLoading: false }))
      .catch(error => console.log(error));
      setTimeout(() => {
        console.log('state', this.state)
      }, 3000);

    fetch('https://swapi.co/api/planets/')
      .then(response => response.json())
      .then(data => this.fetchResidents(data.results))
      .then(planets => this.setState({ planets: planets, isLoading: false  }))
      .catch(error => console.log(error));

    fetch('https://swapi.co/api/vehicles/')
      .then(response => response.json())
      .then(data => this.fetchVehicles(data.results))
      .then(vehicles => this.setState({ vehicles: vehicles, isLoading: false }))
      .catch(error => console.log(error))

    this.fetchFilm();
  }

  fetchFilm = () => {
    let filmNumber = Math.floor(Math.random() * (7 -1) + 1)
    fetch(`https://swapi.co/api/films/${filmNumber}`)
      .then(response => response.json())
      .then(film => film.opening_crawl)
      .then(crawl => this.setState({ crawl: crawl, isLoading: false }))
      .catch(error => console.log(error))
  }

  fetchPeople = (people) => {
    const promises = people.map(person => {
      return fetch(person.homeworld)
        .then(response => response.json())
        .then(data => ({
          homeworld: data.name,
          population: data.population,
          name: person.name,
          species: person.species
         }))
        .catch(error => console.log(error));
    });
    return Promise.all(promises);
  };

  fetchSpecies = (people) => {
    const promises = people.map(person => {
      return fetch(person.species)
        .then(response => response.json())
        .then(data => ({
          ...person,
          language: data.language,
          species: data.name
        }))
        .catch(error => console.log(error));
    });
    return Promise.all(promises);
  };

  fetchResidents = (planets) => {
    const planetsArray = planets.map(planet => {
      let nameArray = [];
      planet.residents.map(resident => {
        return fetch(resident)
        .then(response => response.json())
        .then(data => nameArray.push(data.name))
        .catch(error => console.log(error))
      });
      return {
        name: planet.name,
        terrain: planet.terrain,
        population: planet.population,
        climate: planet.climate,
        residents: nameArray
      }
    });
    return planetsArray
  };

  fetchVehicles = (vehicles) => {
    return vehicles.map(vehicle => {
      return {
        name: vehicle.name,
        model: vehicle.model,
        class: vehicle.vehicle_class,
        numberOfPassengers: vehicle.passengers
      }
    });
  };

  render() {
    return (
      <main>
        {this.state.isLoading && <p>Hold your horses</p>}
        {console.log('STATE', this.state)}
        <Cards people={this.state.people} planets={this.state.planets} vehicles={this.state.vehicles}/>
      </main>
    )
  }
}

export default App;
