import React from 'react';

const Card = ({ card }) => {
    return (
        <img src={card.image} alt={card.value + "of " + card.suit} />
    )
}

export default Card;