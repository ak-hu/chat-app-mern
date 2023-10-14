function SubmitModal({ setModalActive, submText, warnText, handleFunction }) {
    return (
        <div className="submit modal-wrapper">
            <div className="modal-container">
                <div className="text">
                    <b>{warnText}</b>
                    <span>{submText}</span>
                </div>
                <div className="buttons">
                    <button className="button secondary"
                        onClick={handleFunction}>
                        Leave
                    </button>
                    <button className="button"
                        onClick={() => { setModalActive("not") }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubmitModal;