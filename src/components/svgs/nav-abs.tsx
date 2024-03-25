type NavProps = {
  width: number;
  borderWidth: number;
};
const Nav = (props: NavProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="63.593">
    <path
      d={`M.5 63.093h${230 + props.width + (props.borderWidth * 2)}.817V49.177c-26.241-.218-${40 + props.borderWidth}.318-.659-${44 + props.borderWidth}.105-1.949-5.302-1.807-10.889-5.508-26.641-21.871-6.737-6.998-13.91-13.726-18.955-18.064-3.217-2.766-9.388-5.784-13.6-6.051-15.187-.961-${8 + props.width}.351-1.004-${24 + props.width}.215 0-4.212.266-10.383 3.285-13.6 6.051-5.045 4.338-12.218 11.066-18.955 18.064C${55 + props.borderWidth}.494 41.72 ${49 + props.borderWidth}.908 45.421 ${44 + props.borderWidth}.606 47.228 ${40 + props.borderWidth}.818 48.518 26.741 48.959.5 49.177h0z`}
      fill="var(--color-surface-alt)"
      // stroke="#a00"
    />
  </svg>
);

export default Nav;

