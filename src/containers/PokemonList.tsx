import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { GetPokemonList } from '../actions/PokemonActions';

import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface PokemonListState {
    Loading: boolean;
    data: {
      name: string;
    }[];
    errorMsg: string;
    count: number;
  }

const PokemonList = (props:any) => {
  const [search, setSearch] = useState<string | undefined>();
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const PokemonList = useSelector((state: { PokemonList: PokemonListState }) => state.PokemonList);

  useEffect(() => {
    FetchData(1);
  }, []);

  const FetchData = (page = 1) => {
    dispatch(GetPokemonList(page));
  };

  const showData = () => {
    if (PokemonList?.Loading) {
      <p>Loading...</p>;
    }

    if (!_.isEmpty(PokemonList?.data)) {
      return (
        <div className="list-wrapper">
          {PokemonList.data.map((el) => {
            return (
              <div className="pokemon-item">
                <p>{el.name}</p>
                <div className="bottom-color">
                  <Link to={`/pokemon/${el.name}`}>view</Link>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (PokemonList?.errorMsg !== "") {
      return <p>{PokemonList?.errorMsg}</p>;
    }

    return <p>Unable to get data</p>;
  };

  return (
    <div>
      <div className={"search-wrapper"}>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => props.history?.push(`/pokemon/${search}`)}>
          search
        </button>
      </div>
      {showData()}
      {!_.isEmpty(PokemonList?.data) && (
        <ReactPaginate
          pageCount={Math.ceil(PokemonList?.count / 18)}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={(data) => FetchData(data.selected + 1)}
          containerClassName={"pagination"}
        />
      )}
    </div>
  );
};

export default PokemonList;