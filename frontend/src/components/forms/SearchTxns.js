import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { AccountContext } from "../pages/Accounts";
import Button from "../atoms/Button";

export default function SearchTxns({ className = "" }) {
  const { searchTxns, setSearchResults, searchResults } =
    useContext(AccountContext);

  const [search, setSearch] = useState("");
  const onChangeSearch = (e) => setSearch(e.target.value);

  return (
    <>
      <form
        onSubmit={(e) => searchTxns(e, search)}
        className={className + " d-flex"}>
        <Input
          onFocus={(e) => e.target.select()}
          value={search}
          onChange={onChangeSearch}
          placeholder="Search"
        />
        {searchResults.length > 0 && (
          <Button
            icon="bi:x-lg"
            onClick={() => {
              setSearchResults([]);
              setSearch("");
            }}
          />
        )}
      </form>
    </>
  );
}
