import React, { Component } from 'react'
import axios from "axios"
import Card from './Card';
import "./Deck.css"

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
export default class extends Component {
    constructor() {
        super();
        this.state = {
            deck: null, drawn: []
        }
    }
    async componentDidMount() {
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle`)
        this.setState({
            deck: deck.data
        })
    }
    getCard = async () => {
        let deck_id = this.state.deck.deck_id;
        try {
            let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
            let cardRes = await axios.get(cardUrl);
            if (!cardRes.data.success) {
                throw new Error("No card remaining!");
            }
            let card = cardRes.data.cards[0]
            this.setState(st => ({
                deck: cardRes.data,
                drawn: [
                    ...st.drawn,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.value} of ${card.suit}`
                    }
                ]
            }));
        } catch (err) {
            alert(err);
        }
    }
    render() {
        const cards = this.state.drawn.map(c =>
            <Card key={c.id} name={c.name} image={c.image} />
        )
        return (
            <div className="deck">
                <h1 className="Deck-title">♦ Card Dealer ♦</h1>
                <h2 className="Deck-title subtitle">♦ A little demo made with React ♦</h2>
                <button className="Deck-btn" onClick={() => this.getCard()}>Get Card!</button>
                <div className="Deck-cardarea">{cards}</div>
            </div>
        )
    }
}
