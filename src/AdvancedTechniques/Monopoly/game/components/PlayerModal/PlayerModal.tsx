import { getTile, rollDice } from '../../monopoly/helpers';
import { Monopoly } from '../../monopoly/Monopoly';
import { ActionTile, PropertyTile, Tile } from '../../monopoly/tiles';
import { ActionType, TileType } from '../../monopoly/tiles/tiles.types';
import { ReactElement, useEffect, useState } from 'react';

type PlayerModalProps = {
  game: Monopoly;
}

export const PlayerModal = ({ game }: PlayerModalProps): ReactElement => {
  const player = game.getCurrentPlayer();
  const { name, previousRoll, jailTerm, money, properties, completedSets, position, doublesCounter, getOutOfJailFreeCardCount } = player;

  const isJailed = jailTerm > 0;
  const totalWorth = player.getTotalWorth();
  const tile: Tile = getTile(game, position);

  const [round, setRound] = useState({
    turn: 1,
    hasRolled: false,
    hasResolved: false
  });

  const roll = () => {
    const diceRoll = rollDice();
    console.log(`${player.name} rolled: ${diceRoll.values}`);
    player.takeTurn(diceRoll);
    setRound({...round, hasRolled: true});
  };

  const resolvePurchase = () => {
    player.resolvePurchase(tile as PropertyTile);
    setRound({...round, hasResolved: true});
  };

  const resolveAuction = () => {
    (tile as PropertyTile).auction(player);
    setRound({...round, hasResolved: true});
  }

  const resolvePayment = () => {
    player.resolvePayment(tile as PropertyTile, 1);
    setRound({...round, hasResolved: true});
  }

  const resolveAction = () => {
    (tile as ActionTile).action(player);
    setRound({...round, hasResolved: true});
  }

  const getOutOfJailFree = () => {
    console.log(`${player.name} used a get out of jail free card`);
    player.useGetOutOfJailFreeCard();
    setRound({...round});
  }

  const build = () => {
    console.log('build houses or hotels on your complete sets')
    const setBox = document.createElement('div');
    const propertyBox = document.createElement('div');
    completedSets.forEach(set => {
      const setButton = document.createElement('button');
      setButton.textContent = set;
      setButton.addEventListener('click', () => {
        console.log(`selected the ${set} properties`);
        const setProperties = properties.filter(property => property.color === set);
        setProperties.forEach(property => {
          const propertyButton = document.createElement('button');
          propertyButton.textContent = property.name;
          propertyButton.addEventListener('click', () => {
            player.buyHouse(property);
            setRound({...round});
          });
          propertyBox.appendChild(propertyButton);
        });
        propertyBox.style.position = 'absolute';
        propertyBox.style.top = '500px';
        document.getElementById('root')?.appendChild(propertyBox);
      });
      setBox.appendChild(setButton);
    });
    setBox.style.position = 'absolute';
    setBox.style.top = '400px';
    document.getElementById('root')?.appendChild(setBox);
  }
  const mortgage = () => {
    console.log('mortgage your properties to the bank')
  }
  const sell = () => {
    console.log('sell houses or hotels to the bank')
  }
  const offer = () => {
    console.log('offer to buy properties from other players')
  }

  const endTurn = () => {
    setRound({
      turn: round.turn + 1,
      hasRolled: false,
      hasResolved: false,
    });
    if (!doublesCounter) {
      console.log(`${player.name} ended their turn`);
      game.incrementTurn();
    }
  }

  const { hasRolled, hasResolved } = round;
  const awaitingTileResolution = !hasResolved && hasRolled;
  const awaitingTurnEnd = hasResolved && hasRolled;

  const isProperty = tile.type === TileType.Property;
  const hasOwner = !!(tile as PropertyTile).owner;
  const isOwner = (tile as PropertyTile).owner === player;
  const isOwnedByAnotherPlayer = hasOwner && !isOwner;

  const isAction = tile.type === TileType.Action;
  
  if (
    awaitingTileResolution
    && (
      tile.type === TileType.Basic
      || (isProperty && isOwner)
      || (isAction && (tile as ActionTile).actionType === ActionType.Go)
    )
  ) {
    setRound({...round, hasResolved: true});
  }

  if (awaitingTurnEnd && doublesCounter > 0) endTurn();

  const canBuild = completedSets.filter(set => set !== 'black' && set !== 'white').length;
  const canMortgage = properties.length;
  const canSellBuildings = properties.length && properties.map(property => property.houses).reduce((prev, cur) => prev + cur) > 0;

  return null;
  // (
  //   <div style={{background: isJailed ? 'red' : 'none'}}>
  //     <div>{`${name}'s turn`}</div>
  //     <div>{`roll: ${previousRoll.total} ${previousRoll.values}, doubles: ${previousRoll.doubles}, counter: ${doublesCounter}`}</div>
  //     <div>{`Jailed: ${isJailed}`}</div>
  //     <div>{`Get out of jail free cards: ${getOutOfJailFreeCardCount}`}</div>
  //     <div>{`Money: £${money}`}</div>
  //     <div>{`Total Worth: £${totalWorth}`}</div>
  //     <div>Properties: {properties.map(property => <span style={{background: property.color, color: property.color !== 'white' ? 'white' : 'black', border: property.color === 'white' ? '1px solid black' : 'none'}} key={property.name}>{property.name}</span>)}</div>
  //     <div>Completed Sets: {completedSets.map(set => <span style={{background: set, color: set !== 'white' ? 'white' : 'black', border: set === 'white' ? '1px solid black' : 'none'}} key={set}>{set}</span>)}</div>
  //     <div>{`Current Position: ${position} - ${tile.name}`}</div>
  //     <div>{tile.description}</div>
  //     <div style={{top:200, position:'absolute'}}>
  //       <button disabled={!canBuild} onClick={build}>Build</button>
  //       <br/>
  //       <button disabled={!canMortgage} onClick={mortgage}>Mortgage Properties</button>
  //       <br/>
  //       <button disabled={!canSellBuildings} onClick={sell}>Sell Buildings</button>
  //       <br/>
  //       <button disabled={!canMortgage} onClick={offer}>Make Offer</button>
  //       <br/>
  //       {!hasRolled && isJailed && getOutOfJailFreeCardCount > 0 && <button onClick={getOutOfJailFree}>Get Out of Jail Free</button>}
  //       {!hasRolled && <button onClick={roll}>Roll</button>}

  //       {awaitingTileResolution && (
  //         <>
  //           {isProperty && (
  //             <>
  //               {!hasOwner && (
  //                 <>
  //                   <button disabled={totalWorth < (tile as PropertyTile).cost} onClick={resolvePurchase}>Buy</button>
  //                   <button onClick={resolveAuction}>Auction</button>
  //                 </>
  //               )}
  //               {isOwnedByAnotherPlayer && (
  //                 <button onClick={resolvePayment}>Pay</button>
  //               )}
  //             </>
  //           )}
  //           {isAction && (
  //             <button onClick={resolveAction}>Resolve Action</button>
  //           )}
  //         </>
  //       )}

  //       {awaitingTurnEnd && (
  //         <button onClick={endTurn}>End Turn</button>
  //       )}
  //     </div>
  //   </div>
  // );
}
