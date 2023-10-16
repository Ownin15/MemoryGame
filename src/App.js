import {useEffect, useState} from 'react';
import './App.css';
import SingleCard from './components/SingleCard';


const cardImages = [
  { "src": "./img/helmet-1.png", matched: false},
  { "src": "./img/potion-1.png", matched: false},
  { "src": "./img/ring-1.png", matched: false},
  { "src": "./img/scroll-1.png", matched: false},
  { "src": "./img/shield-1.png", matched: false},
  { "src": "./img/sword-1.png", matched: false}
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disableCard, setDisableCard] = useState(false)
  const [gridCard, setGridCard] = useState(true)

  // Shuffle function
  const shuffleCards = () => {
    const shuffledCards = [ ...cardImages, ...cardImages ]
      .sort(() => Math.random() - 0.5 )
      .map(( card ) => ({ ...card, id: Math.random() }))

      setChoiceOne(null)
      setChoiceTwo(null)
      setCards(shuffledCards)
      setTurns(0)
  }

  // Choice Handler
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }
  
  //compare cards
  useEffect(() => { 
    
    if (choiceOne && choiceTwo ) {
      setDisableCard(true)
    
      //If card match
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card=>{
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()

      } else {
        //If not match
        setTimeout( () => resetTurn(), 1000 )
      }
    }
  },[choiceOne, choiceTwo, cards])

   // Logic to perform when all cards are flipped and matched
   useEffect ( () => {
    const allMatched = cards.every(card => card.matched)
      if (!allMatched) {
        setGridCard(true)
      }else{
        setGridCard(false)
        }
  }, [cards]) 

  // Reset Choice if Wrong
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisableCard(false)
  }

  // Open Setcards without clicking new game / entry 
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Memory Game</h1>

      {cards.every(card => card.matched) && (
      <div className="message-box">
        <h2>Congratulations!</h2>
        <p>You completed the game in {turns} turns.</p>
        <button onClick={shuffleCards}>Retry</button>
      </div>
      )}

      {gridCard &&(
      <div>
        <div className="card-grid">
          {cards.map(card => (
            <SingleCard 
              key={card.id} 
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disableCard}
            />
          ))}
        </div>
        <p>Turns: { turns }</p>
      </div>
      )}
    </div>
    
  );
}

export default App