import React from "react";
import { Button } from "@material-ui/core";

export default class Combos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movesList: []
    };
  }

  renderMoves() {
    const moves = this.state.movesList;
    console.log(moves);
    const allMoves = moves.map((val, index) => {
      console.log(val.name, index);
      return index;
    });
    console.log(allMoves);
  }

  addNewCombo = () => {
    const maxMoves = 10;
    const numberOfMoves = Math.floor(Math.random() * maxMoves) + 1;
    let moveList = [];
    for (let i = 0; i < numberOfMoves; i++) {
      let random = Math.floor(Math.random() * moves.length);
      moveList.push(moves[random]);
    }
    console.log(numberOfMoves, moveList);
    this.setState({
      movesList: moveList
    });
    this.renderMoves();
  };

  render() {
    return (
      <div>
        <Button onClick={this.addNewCombo}>Add Move</Button>
      </div>
    );
  }
}

const moves = [
  { name: "jab", key: 1 },
  { name: "cross", key: 2 },
  { name: "left hook", key: 3 },
  { name: "right upper-cut", key: 4 },
  { name: "left upper-cut", key: 5 },
  { name: "right-hook", key: 6 }
];
