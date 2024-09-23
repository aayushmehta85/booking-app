import Icon from "../../Common/Icons";


export default function AddressLink({ children, className = null }) {
	return (
		<a
      className={`${!className ? className : ''} flex gap-1 font-semibold underline`}
			target="_blank"
			href={`https://maps.google.com/?q=${children}`}
		>
			<Icon type="location"/>
			{children}
		</a>
	);
}
