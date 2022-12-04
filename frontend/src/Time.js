export default function Time(props) {
  return (
    <div style={{ fontSize: '2em', fontWeight: 'bold'}}>{new Date().toLocaleString()}</div>
  )
}
