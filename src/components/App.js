import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRecipe, removeFromCalandar } from '../actions'
import  CalendarIcon  from 'react-icons/lib/fa/calendar-plus-o'
import { capitalize } from '../utils/helpers'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'

class App extends Component {
  state = {
    foodModalOpen: false,
    meal: null,
    day: null,
    food: null
  }
  openFoodModal = ({meal, day})=>{
    this.setState({
      foodModalOpen: true,
      meal,
      day
    })
  }
  closeFoodModal = ()=>{
    this.setState({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null
    })
  }
  searchFood = (e) => {
    if (!this.input.value) {
      return
    }

    e.preventDefault()

    this.setState(() => ({ loadingFood: true }))

    fetchRecipes(this.input.value)
      .then((food) => this.setState(() => ({
        food,
        loadingFood: false,
      })))
  }
  render() {
    console.log(this.props);
    const { foodModalOpen, loadingFood, food } = this.state
    const { calendar, removeRecipe, selectRecipe } = this.props
    const mealOrder = ['breakfast', 'lunch', 'dinner']
    return (
      <div className='container'>
        <ul className='meal-types'>
          {mealOrder.map((mealType) => (
            <li key={mealType} className='subheader'>
              {capitalize(mealType)}
            </li>
          ))}
        </ul>

        <div className='calendar'>
          <div className='days'>
            {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
          </div>
          <div className='icon-grid'>
            {calendar.map(({ day, meals }) => (
              <ul key={day}>
                {mealOrder.map((meal) => (
                  <li key={meal} className='meal'>
                    {meals[meal]
                      ? <div className='food-item'>
                          <img src={meals[meal].image} alt={meals[meal].label}/>
                          <button onClick={() => removeRecipe({meal, day})}>Clear</button>
                        </div>
                      : <button onClick={() => this.openFoodModal({meal, day})} className='icon-btn'>
                          <CalendarIcon size={30}/>
                        </button>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      
      <Modal
        className='modal'
        overlayClassName='overlay'
        isOpen={foodModalOpen}
        onRequestClose={this.closeFoodModal}
        contentLabel='Modal'
      >
        <div>
          {loadingFood === true
            ? <Loading delay={200} type='spin' color='#222' className='loading' />
            : <div className='search-container'>
                <h3 className='subheader'>
                  Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                </h3>
                <div className='search'>
                  <input
                    className='food-input'
                    type='text'
                    placeholder='Search Foods'
                    ref={(input) => this.input = input}
                  />
                  <button
                    className='icon-btn'
                    onClick={this.searchFood}>
                      <ArrowRightIcon size={30}/>
                  </button>
                </div>
                {food !== null && (
                  <FoodList
                    food={food}
                    onSelect={(recipe) => {
                      selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                      this.closeFoodModal()
                    }}
                  />)}
              </div>}
        </div>
      </Modal>
      </div>

    ); 
  }
}
function mapStateToProps({ 	calendar  , food}){
  // console.log(calendar);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let meals = days.map((day)=>({
    day: day,
    meals : Object.keys(calendar[day]).reduce((meals,meal)=>{
      meals[meal] = calendar[day][meal]
        ? food[calendar[day][meal]]
        : null
      return meals
    },{})
  }))
  return {calendar : meals};
}
function mapDispatchToProps(dispatch){
  // console.log(dispatch);
  // return dispatch;
  return {
    selectRecipe: (data)=> dispatch(addRecipe(data)),
    removeRecipe: (data)=> dispatch(removeFromCalandar(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
