/* TODO: Not yet implemented */
import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import "./Clock.scss";

function RenderedMoves(props) {
  const position = props.moves.length - 1;
  if (position < 0) {
    return null;
  }
  const moves = props.moves[position];
  const items = moves.map((item, i) => (
    <div key={i + "" + position} className={"empty empty-" + (i + 1)}>
      {item.name}
    </div>
  ));

  return (
    <div>
      <div className={props.show ? "emp" : ""}>{items}</div>
    </div>
  );
}

export default class Combos extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
    this.state = {
      movesList: [],
      animate: false
    };
  }

  addNewCombo = () => {
    if (!this.props.running) {
      return;
    }
    this.setState({ animate: false });
    const maxMoves = 10;
    const numberOfMoves = Math.floor(Math.random() * maxMoves) + 1;
    const newMoves = [...Array(numberOfMoves)].map((value, i) => {
      const random = Math.floor(Math.random() * moves.length);
      return moves[random];
    });
    this.setState(state => ({
      movesList: [...state.movesList, newMoves]
    }));
    // this.renderMoves();
    setTimeout(() => {
      this.setState({ animate: true });
    }, 0);
    // setTimeout(() => {
    //   console.log("stop");
    //   this.setState({
    //     animate: false
    //   });
    //   clearTimeout(this.timeout);
    // }, 3000);

    this.timeout = setTimeout(() => {
      this.addNewCombo();
    }, 1000 * numberOfMoves + 4000);
  };

  render() {
    return (
      <div>
        <Button onClick={this.addNewCombo}>Add Move</Button>
        <RenderedMoves moves={this.state.movesList} show={this.state.animate} />
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
