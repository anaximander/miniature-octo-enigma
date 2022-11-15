import React from "react";
import styled from "styled-components";

// TODO: Fix positioning
const DistrictSummaryBase = styled.div`
  display: inline-block;
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

const SummaryHeader = styled.h2`
  font-size: 24px;
  margin: 0px 5px;
  padding: 0px;
`;

const DistrictSummary = (props) => {
  return (
    <DistrictSummaryBase>
      <SummaryHeader>{props.name}</SummaryHeader>
      {/* TODO display district summary data here */}
    </DistrictSummaryBase>
  );
};

export default DistrictSummary;
