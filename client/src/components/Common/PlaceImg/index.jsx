import Image from "../Image";


export default function PlaceImg({ photos, index = 0, className = null }) {
	return (
		photos?.length>0 && (
			<Image className={className ? className : 'object-cover'} src={photos[index]} alt="" />
		)
	);
}
