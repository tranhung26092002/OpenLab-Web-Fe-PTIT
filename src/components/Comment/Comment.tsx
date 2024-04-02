import React from 'react';
const Comment: React.FC = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#ccc" }}>
            <div className="card p-4" style={{ width: '700px', borderRadius: '12px' }}>
                <p className="h5 font-weight-bold text-primary cursor-pointer transition hover:text-black">Add Comment/Questions</p>
                <textarea
                    className="form-control mt-5"
                    style={{
                        height: '160px',
                        borderColor: '#ED64A6',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.75rem'
                    }}
                    placeholder="Add your comments here">
                </textarea>

                <div className="d-flex justify-content-between mt-2">
                    <button className="btn text-white" style={{ backgroundColor: '#3B82F6', width: '150px', borderRadius: '0.5rem' }}>Submit comment</button>
                    <p className="text-primary small">Enter atleast 15 characters</p>
                </div>
            </div>
        </div>
    );
}

export default Comment;