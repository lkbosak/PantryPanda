import { useNavigate } from 'react-router-dom';

const boxStyle: React.CSSProperties = {
	background: 'rgba(255,255,255,0.95)',
	borderRadius: '12px',
	boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
	padding: '40px 32px',
	maxWidth: '400px',
	margin: '40px auto',
	textAlign: 'center',
};

const EnhanceSecurity = () => {
	const navigate = useNavigate();
	return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				backgroundImage: "url('/home-bg.jpg')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				width: '100vw',
			}}>
			<button onClick={() => navigate(-1)} style={{alignSelf: 'flex-start', marginBottom: 24, padding: '8px 24px', borderRadius: 6, border: 'none', background: '#eee', cursor: 'pointer'}}>Back</button>
			<div style={boxStyle}>
				<h2>Enhance Security</h2>
				<p>This is the Enhance Security page.</p>
			</div>
		</div>
	);
};

export default EnhanceSecurity;
