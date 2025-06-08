import React, {useState} from 'react'

export default function Child({onClick, onHover}:{onClick:()=>void, onHover:()=>void}) {
console.log('child render');
  return (
    <div onClick={onClick} onMouseOver={onHover}>
      <span>Je suis un enfant</span>
    </div>
  )
}
