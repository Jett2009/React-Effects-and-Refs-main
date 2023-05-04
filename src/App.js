import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import "./App.css";

function App() {
	const BASE_URL = "http://deckofcardsapi.com/api/deck/";
	const deckId = useRef();
	const remaining = useRef();
	const [card, setCard] = useState(null);
	const timerId = useRef();
	const [contDraw, setContDraw] = useState(false);
	const [isPaused, setIsPaused] = useState(false); // added state variable

	useEffect(function setupDeck() {
		async function getDeck() {
			const resp = await axios.get(BASE_URL + "new/shuffle/");
			deckId.current = resp.data.deck_id;
			remaining.current = resp.data.remaining;
		}
		getDeck();
	}, []);

	useEffect(
		function drawTimer() {
			if (contDraw) {
				timerId.current = setInterval(() => {
					if (remaining.current !== 0) {
						drawCard();
					} else {
						setContDraw(false);
					}
					setIsPaused(false); // update isPaused state variable
				}, 1000);
			}

			return function cleanUpDrawTimer() {
				clearInterval(timerId.current);
			};
		},
		[contDraw]
	);

	function handleClick() {
		if (contDraw) {
			setContDraw(false);
			setIsPaused(true); // update isPaused state variable
		} else {
			setContDraw(true);
			setIsPaused(false); // update isPaused state variable
		}
	}

	function drawCard() {
		async function draw() {
			const resp = await axios.get(
				BASE_URL + deckId.current + "/draw/?count=1"
			);
			remaining.current = resp.data.remaining;
			setCard(resp.data.cards[0]);
		}
		draw();
	}

	function shuffleDeck() {
		async function resetDeck() {
			const resp = await axios.get(BASE_URL + deckId.current + "/shuffle/");
			remaining.current = resp.data.remaining;
			setCard(null);
		}
		resetDeck();
		alert("Deck shuffled!");
	}

	return (
		<div className="App">
			<button onClick={handleClick}>
				{contDraw ? "Stop Drawing" : "Grab a card"}
			</button>
			{isPaused && <button onClick={shuffleDeck}>Shuffle the deck!</button>}
			<div>{card ? <Card card={card} /> : <div />}</div>
			{remaining.current === 0 && (
				<button onClick={shuffleDeck}>Shuffle the deck!</button>
			)}
		</div>
	);
}

export default App;
