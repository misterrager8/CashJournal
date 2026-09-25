import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { AccountContext } from "../pages/Accounts";
import Button from "../atoms/Button";
import moment from "moment-timezone";

export default function SearchTxns({ className = "" }) {
  const { searchTxns, setSearchResults, searchResults } =
    useContext(AccountContext);

  const [search, setSearch] = useState("");
  const onChangeSearch = (e) => setSearch(e.target.value);

  const [startDate, setStartDate] = useState(
    moment
      .tz(new Date(), "America/New_York")
      .startOf("month")
      .format("YYYY-MM-DD"),
  );
  const onChangeStartDate = (e) => setStartDate(e.target.value);

  const [endDate, setEndDate] = useState(
    moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD"),
  );
  const onChangeEndDate = (e) => setEndDate(e.target.value);

  return (
    <>
      <form
        onSubmit={(e) => searchTxns(e, search, startDate, endDate)}
        className={className + " d-flex"}>
        <Input
          required={false}
          onFocus={(e) => e.target.select()}
          value={search}
          onChange={onChangeSearch}
          placeholder="Search"
        />
        <input
          onChange={onChangeStartDate}
          value={startDate}
          type="date"
          className="form-control form-control-sm w-25 mx-1"
        />
        <input
          onChange={onChangeEndDate}
          value={endDate}
          type="date"
          className="form-control form-control-sm w-25 mx-1"
        />
        {searchResults.length > 0 && (
          <Button
            border={false}
            icon="bi:x-lg"
            onClick={() => {
              setSearchResults([]);
              setSearch("");
              setStartDate(
                moment
                  .tz(new Date(), "America/New_York")
                  .startOf("month")
                  .format("YYYY-MM-DD"),
              );
              setEndDate(
                moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD"),
              );
            }}
          />
        )}
        <Button type_="submit" className="d-none" />
      </form>
    </>
  );
}
