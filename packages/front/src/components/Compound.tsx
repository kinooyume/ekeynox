import { Component } from "solid-js";

const Typing : Component & { InnerComp: Component }= () => {
  return <div></div>;
};

const innerComp = () => {
  return <div></div>;
};

Typing.InnerComp = innerComp;

