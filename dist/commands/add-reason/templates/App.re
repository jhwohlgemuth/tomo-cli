[@react.component]
let make = (~name) =>
  <div> {ReasonReact.string(name ++ " is functioning as desired!")} </div>;