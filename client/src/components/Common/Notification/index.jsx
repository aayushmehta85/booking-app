import { NOTIFICATION_TYPE } from "../../../utils/contants";

const Notification = ({ notification,setNotification}) => {
  return (
		<p
			className={`notification ${
				notification?.type === NOTIFICATION_TYPE.ERROR
					? NOTIFICATION_TYPE.ERROR
					: NOTIFICATION_TYPE.SUCCESS
			}`}
		>
			{notification.message}
			<span
				className="close-icon"
				onClick={() =>
					setNotification({
						type: null,
						message: null,
					})
				}
			>
				×
			</span>
			<style jsx>
				{`
					.notification {
						font-size: 16px;
						position: relative;
						&.error {
							color: #d62f25;
							&:before {
								background: #d62f25;
							}
							.close-icon {
								color: #d62f25;
							}
						}

						&.success {
							color: #099a4f;
							&:before {
								background: #099a4f;
							}
							.close-icon {
								color: #099a4f;
							}
						}
						box-shadow: 0 4px 16px #ccc;
						border-radius: 5px;
						max-width: 900px;
						margin: 10px auto 30px;
						min-height: 40px;
						padding: 20px 32px;
						@media (max-width: 767px) {
							margin: 20px;
						}
						&:before {
							content: '';
							position: absolute;
							width: 2px;
							height: 100%;
							top: 0;
							left: 0;
						}
						.close-icon {
							font-size: 21px;
							font-weight: 700;
							line-height: 1;
							text-shadow: 0 1px 0 #fff;
							color: green;
							cursor: pointer;
							position: absolute;
							right: 15px;
							top: 8px;
						}
					}
				`}
			</style>
		</p>
	);
}

export default Notification