import React, { Component }from 'react';
import './App.css';
// import Fetcher from '../Fetcher/Fetcher';

class App extends Component {
  constructor() {
    super();
    this.state = {
      vehicles: [],
      people: [],
      planets: [],
      films: []
    }
  }

  componentDidMount() {
    fetch('https://swapi.co/api/people/')
      .then(response => response.json())
      .then(data => this.fetchPeople(data.results))
      .then(data => this.fetchSpecies(data))
      .then(people => this.setState({people: people}))
      .catch(error => console.log(error));
      setTimeout(() => {
        console.log('state', this.state)
      }, 3000);

    fetch('https://swapi.co/api/planets/')
      .then(response => response.json())
      // .then(data => console.log(data.results));
      // .then(data => data.results.map(datum => ({
      //   name: datum.name,
      //   terrain: datum.terrain,
      //   population: datum.population,
      //   climate: datum.climate,
      //   residents: datum.residents
      // })))
      .then(data => this.fetchResidents(data.results))
      .then(data => console.log('after function', data))
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

  render() {
    if (this.state.people.length) {
    let peopleList = this.state.people.map(person => {
      return (<>
        <p>{person.name}</p>
        <p>{person.homeworld}</p>
        <p>{person.species}</p>
        <p>{person.language}</p>
        <p>{person.population}</p>
      </>)}
      );
      return (
        <main>
          {peopleList}
        </main>
      );
    } else {
    return (
      <main>
        <p>Blah</p>
      </main>
      )
    }
  }
}

export default App;
