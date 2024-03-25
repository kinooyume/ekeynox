const Cross = () => (
  <svg xmlns="http://www.w3.org/2000/svg" id="cross" width="20" height="20">
    <path
      fill="none"
      stroke="grey"
      stroke-dasharray="4"
      stroke-dashoffset="12"
      stroke-linecap="round"
      stroke-width="2"
      d="M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5"
    >
      <animate
        fill="freeze"
        attributeName="stroke-dashoffset"
        dur="1s"
        values="12;0"
      />
    </path>
  </svg>
);

export default Cross;
