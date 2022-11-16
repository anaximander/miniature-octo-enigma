import React from "react";
import styled from "styled-components";

const ControlPanelBase = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
  border-radius: 4px;
  background-color: #fff;
  z-index: 1 !important;
  padding: 6px;
  font-weight: bold;
  box-shadow: 0 0 0 2px rgb(0 0 0/10%);
`

const PanelHeader = styled.h2`
  font-size: 24px;
  margin: 0px 5px 10px 5px;
  padding: 0px;
  border-bottom: 1px solid black;
`;

const ControlLabel = styled.label`
  display: block;
  font-size: 12px;
  margin: 0px 10px 0px 5px;
  padding: 0px;
`;

const Control= styled.div`
  display: flex;
  align-items: center;
`;

const ControlPanel = (props) => {
  return (
    <ControlPanelBase>
      <PanelHeader>{props.header}</PanelHeader>
      {props.controls.map(c => 
        <Control key={c.number}>
          <ControlLabel>{c.label}</ControlLabel>
          <select multiple={true} onChange={(e) => {
            c.onChange([...e.target.selectedOptions].map(o => o.value));
          }}>
            {c.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </Control>
      )}
    </ControlPanelBase>
  );
};

export default ControlPanel;
