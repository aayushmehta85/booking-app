const InputField = ({ type, placeholder, value, errorMessage, onChangeHandler, onBlurHandler }) => {
	return (
		<div className="container">
			<div className="input-container">
				<input
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChangeHandler}
					onBlur={onBlurHandler}
					className={`${errorMessage ? 'error' : ''}`}
				/>
			</div>
			{errorMessage && <span className="error-msg">{errorMessage}</span>}
			<style jsx>
				{`
					.container {
						height: 65px;
						input {
							&:focus-visible {
								outline: transparent;
								border: 1px solid #3597ec;
							}
						}
						.error {
							border: 1px solid #f00;
						}
						.error-msg {
							position: relative;
							top: -12px;
							left: 10px;
							font-size: 12px;
							text-align: left;
							letter-spacing: 0;
							color: #d93025;
							opacity: 1;
						}
					}
				`}
			</style>
		</div>
	);
};

export default InputField;
