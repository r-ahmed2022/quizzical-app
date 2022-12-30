
import { nanoid } from "nanoid";
import React, {useState, useEffect} from "react"
import he from "he"
import Quiz from "./components/Quiz";

export default function App() {
    const [start , setStart] = useState(true)
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    const[restart, setRestart] = useState(0)
    const noofQuestions = 5
    const scoreElement = document.querySelector(".score")

    const getScore = (e) => {
       setCompleted(prev => !prev)
       scoreElement.style.visibility = "visible"
        const temp = questions.map((question) => {
             question.answers.map((option) => {
                 if(option.selected && option.content === question.correct_answer)
                 {
                    return {option}
                 } else {
                      if(option.selected && option.content !== question.correct_answer)
                      {  
                         document.getElementById(option.id).classList.add("wrong")
                         return option
                      } else  if(option.content === question.correct_answer){
                        document.getElementById(option.id).classList.add("chosen_answer")
                        return {option}
                      }
                 }
             })
             return question
        })
        setQuestions(temp)
    }

    const playagain = () => {
      setRestart(prev => prev + 1)
      setCompleted(false)
      setScore(0)
     // setStart(prev => !prev)
      scoreElement.style.visibility = "hidden"

   }

    useEffect(() => {
        const shuffle = (array) => {
        let current = array.length,  random;
         while (current !== 0) {
           random= Math.floor(Math.random() * current);
           current--;
          [array[current], array[random]] = [array[random], array[current]];
        }
         return array;
      }
  
      fetch(`https://opentdb.com/api.php?amount=${noofQuestions}&category=18&difficulty=medium&type=multiple`)
     .then(response => response.json())
     .then(data => {
            setQuestions(data.results.map(question => {
                   return {
                       "id": nanoid(),
                      "question": he.decode(question.question),
                      "correct_answer": question.correct_answer,
                       "answers" : shuffle ([{
                                "content" : he.decode(question.correct_answer),
                                 "isTrue" : true,
                                 "selected" : false,
                                 "id": nanoid()
                   }, 
                   
                     ...question.incorrect_answers.map((answer) => {
                         return {
                             "content": he.decode(answer),
                             "isTrue": false,
                             "selected" : false,
                             "id": nanoid()
                         }
                     })
                   
                  ])
                }
            }))
        })
                
      .catch(err => console.log(err.message))
      
 
     return () => {
       
      console.log(' App Component UNMOUNTED');
    }
    }, [restart])

    function handleClick(e, question, id) {
        const answer = e.target.innerText
        if(question.correct_answer === answer) {
           setScore(prev => prev + 1)

        }
      const temp = questions.map(item => {
           if(item.id === question.id)   {
               return  {...item, 
                answers: item.answers.map(i => {
                  return i.id === id ? {...i, selected: true} : {...i, selected: false}
                })
               }
               } else {
             return item
               }
      })
         setQuestions(temp)
        
    }

      return (
        <div className="wrapper">
        { 
          start ? 
        <div className="start-container">
              <span className="top-blob"></span>
              <div className="start">
                  <h1>Quizzical </h1>
                  <p className="desc">Some description if needed</p>
                  <button className="start-btn" onClick={() => setStart(prev=> !prev)} >Start quiz</button>
              </div>
            <div className="blob2"></div>

        </div>
          :
          <div className="start-container quizscreen">
           <span className="top-blob"></span>
         <div className="last-container">
                   { questions.length > 0 ?
                    questions.map(item =>  {
                    return <Quiz key={item.id} question={item} handleClick={handleClick}  />
                          }) :
                          <p>Loading ....</p>
                   }
                   <span className="score">You have scored {score} / 5 </span> 
            { !completed ?
            <button id="check" className="start-btn" onClick={(e) => getScore(e)}>Check answer</button>
            :
            <button id="play" className="start-btn" onClick={playagain}>Play Again</button>

            }
           

         </div>
         <span className="blob2"></span>

                </div>
        }
        
        </div>
    )
}