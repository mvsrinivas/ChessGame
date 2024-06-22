import React,{useState , useRef , useEffect} from 'react'
import ChessboardJs from 'react-chessboardjs-wrapper'
import {Chess} from 'chess.js'
import io from 'socket.io-client'
import axios from 'axios'
import {useParams} from 'react-router-dom'

const socket = io.connect("http://localhost:8080")
const game = new Chess()


export default function Gameui(){
    const {id, color} = useParams()
    // console.log(color)
    const boardRef = useRef(null);
    const handleBoardInit = (board, boardId) => {
      boardRef.current = board;
      socket.on('message', (onj) => {
        console.log("outside if")
        if(boardRef.current){
          console.log("inside if")
          var movz = onj.source + '-' + onj.target
          console.log(movz)
          game.load(onj.feen)
          boardRef.current.move(movz)
        }
     })
     
      // console.log('Chessboard initialized with id:', boardRef.current.move);
    };

    useEffect(() => {
        socket.emit('joinroom' , id)
    }, [])

    function onSnapEnd(){
      boardRef.current.position(game.fen())
    }
    
    function updateStatus() {
      var status = ''
           var moveColor = 'White'
           if (game.turn() === 'b') {
              moveColor = 'Black'
           }
  
    // checkmate?
           if (game.isCheckmate()) {
              status = 'Game over, ' + moveColor + ' is in checkmate.'
           }
  
    // draw?
           else if (game.isDraw()) {
              status = 'Game over, drawn position'
           }
  
    // game still on
           else {
              status = moveColor + ' to move'
      // check?
                  if (game.isCheck()) {
                       status += ', ' + moveColor + ' is in check'
                  }
           }
          //  console.log(status)
    }
    function onDragStart(source, piece, position, orientation){
       // check whether the movable pieces is white or black return false 
       console.log(game.isGameOver())
       if (game.isGameOver()) return false

       if(game.turn() != color[0]) return false
       
       // only pick up pieces for the side to move
       if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
           (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
         return false
       }
       
    }
    function onDrop(source, target){
       // check whether the position is valid or not by using chess.js
       try{
       var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      })
      var newObj = {
        source : source,
        target : target,
        feen : game.fen()
      }
      socket.emit('message' , {id, newObj})
  
    }catch(e){
      return 'snapback'
    }
    
      updateStatus()
    }
  
  
    const config = {
       position : 'start',
      draggable : true,
      orientation: color,
      onDragStart : onDragStart,
      onDrop : onDrop,
      onSnapEnd : onSnapEnd, 
    }

    return(
        <div>
           <ChessboardJs
             config = {config}
             width="35%"
             onInitBoard={handleBoardInit}
           />

           your game id is {id}
        </div>
    )
}