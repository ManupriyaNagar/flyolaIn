export default function BookFlightPage() {
  return (
    <div>
      <h1>Book Flight</h1>
      <form>
        <label>
          Destination:
          <input type="text" name="destination" />
        </label>
        <button type="submit">Search</button>
      </form>
    </div>
  )
}
