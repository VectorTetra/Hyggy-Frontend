export default function CrossIcon(props: { width?: string; height?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.width || '16px'} // Default width if not provided
			height={props.height || '16px'} // Default height if not provided
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 5.586l2.293-1.293a1 1 0 0 1 1.414 1.414L9.414 7l2.293 2.293a1 1 0 0 1-1.414 1.414L8 8.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L6.586 7 4.293 4.707a1 1 0 0 1 0-1.414z" />
		</svg>
	);
}
