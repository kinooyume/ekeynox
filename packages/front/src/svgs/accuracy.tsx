type AccuracyProps = {
  correct: boolean;
};

const Accuracy = (props: AccuracyProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23.068" height="23">
    <g stroke-dashoffset="513.601">
      <circle
        cx="11.528"
        cy="11.507"
        r="6.091"
        fill={props.correct ? "var(--text-secondary-color)" : "none"}
        stroke="var(--text-secondary-color)"
        stroke-width="1.348"
      />
      <circle
        cx="11.528"
        cy="11.507"
        r="9.311"
        stroke-width="1.374"
        fill="none"
        stroke="var(--text-secondary-color)"
      />
    </g>
    <path
      d="M11.52.632v3.195m.011 15.345v3.195m10.905-10.86h-3.195m-15.413.001H.632"
      fill="none"
      stroke="var(--text-secondary-color)"
      stroke-width="1.264"
      stroke-linecap="round"
    />
    <path
      d="M8.75 11.581l1.836 1.865c.014.014.033.022.052.022s.038-.008.052-.023l3.629-3.854"
      fill="none"
      stroke="var(--color-background-metric-preview)"
      stroke-linecap="round"
      stroke-width="2.247"
    />
  </svg>
);

export default Accuracy;
