import React from 'react'

function Quiz(props) {
   //const [background, setBackground ] = useState(false)
       return (
        <div className="card">
                <div className="question" dangerouslySetInnerHTML={{__html: `${props.question.question}`}}>
                    
                </div>
            <ul className="options">
                
                 {
                    props.question.answers.map(option => {
                        return <li key={option.id}   
                        className={option.selected ?
                         "chosen_answer" : "option"}
                         id={option.id}
                         onClick={(e) => props.handleClick(e,props.question, option.id)}
                         
                         >
                            {option.content}
                         </li>
                    })
                 }

            </ul>
       </div>
    )
}

export default Quiz
