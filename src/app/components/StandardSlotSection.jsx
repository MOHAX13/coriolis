import React from 'react';
import cn from 'classnames';
import SlotSection from './SlotSection';
import StandardSlot from './StandardSlot';
import Module from '../shipyard/Module';
import * as ShipRoles from '../shipyard/ShipRoles';
import { stopCtxPropagation } from '../utils/UtilityFunctions';

/**
 * Standard Slot section
 */
export default class StandardSlotSection extends SlotSection {

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   * @param  {Object} context React Component context
   */
  constructor(props, context) {
    super(props, context, 'standard', 'core internal');
    this._optimizeStandard = this._optimizeStandard.bind(this);
    this._selectBulkhead = this._selectBulkhead.bind(this);
    this._showDW2Menu = this._showDW2Menu.bind(this);
    this._dw2 = this._dw2.bind(this);
    this.selectedRefId = null;
    this.firstRefId = 'maxjump';
    this.lastRefId = 'dw2';
    this.state = {
      showDW2: false,
      DW2Tier: -1,
      DW2Eng: -1,
      DW2Role: '',
      DW2Gfsb: false,
      DW2Gpp: false,
      DW2Fighter: false
    };
  }

  /**
   * Handle focus if the component updates
   * @param {Object} prevProps React Component properties
   */
  componentDidUpdate(prevProps) {
    this._handleSectionFocus(prevProps, this.firstRefId, this.lastRefId);
  }

  /**
   * Use the lightest/optimal available standard modules
   */
  _optimizeStandard() {
    this.selectedRefId = 'maxjump';
    this.props.ship.useLightestStandard();
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * Fill all standard slots with the specificed rating (using max class)
   * @param  {Boolean} shielded True if shield generator should be included
   * @param {integer} bulkheadIndex Bulkhead to use see Constants.BulkheadNames
   */
  _multiPurpose(shielded, bulkheadIndex) {
    this.selectedRefId = 'multipurpose';
    if (bulkheadIndex === 2) this.selectedRefId = 'combat';
    ShipRoles.multiPurpose(this.props.ship, shielded, bulkheadIndex);
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * Trader Build
   * @param  {Boolean} shielded True if shield generator should be included
   */
  _optimizeCargo(shielded) {
    this.selectedRefId = 'trader';
    ShipRoles.trader(this.props.ship, shielded);
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * DW2 Build
   * @param tier
   * @param engineeringLevel
   * @param role
   */
  _dw2() {
    this.selectedRefId = 'dw2';
    this.setState({ showDW2: false });
    ShipRoles.dw2Build(this.props.ship, this.state.DW2Tier, this.state.DW2Eng, this.state.DW2Role, this.state.DW2Gfsb, this.state.DW2Gpp, this.state.DW2Fighter);
    this.props.ship.updateModificationsString()
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  _showDW2Menu(translate) {
    return (
      <div className='select' onClick={(e) => e.stopPropagation()} onContextMenu={stopCtxPropagation}>
        <div className='select-group cap'>{translate('Tier')}</div>
        <ul id={'tier'}>
          <li className={cn({ active: this.state.DW2Tier === 1 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Tier: 1 })} onKeyDown={this._keyDown}
          >{translate('1- Hardcore exploration, fully maximize jump range')}</li>
          <li className={cn({ active: this.state.DW2Tier === 2 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Tier: 2 })} onKeyDown={this._keyDown}
          >{translate('2- Classical shielded exploration')}</li>
          <li className={cn({ active: this.state.DW2Tier === 3 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Tier: 3 })} onKeyDown={this._keyDown}
          >{translate('3- Surface exploration, improved shield')}</li>
          <li className={cn({ active: this.state.DW2Tier === 4 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Tier: 4 })} onKeyDown={this._keyDown}
          >{translate('4- Surface flight, improved shield and thrusters')}</li>
        </ul>
        <hr/>
        <div className='select-group cap'>{translate('Engineering Level')}</div>
        <ul id={'engLevel'}>
          <li className={cn({ active: this.state.DW2Eng === 1 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Eng: 1 })} onKeyDown={this._keyDown}
          >{translate('No engineering')}</li>
          <li className={cn({ active: this.state.DW2Eng === 2 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Eng: 2 })} onKeyDown={this._keyDown}
          >{translate('Only Felicity Farseer and Elvira Martuuk')}</li>
          <li className={cn({ active: this.state.DW2Eng === 3 }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Eng: 3 })} onKeyDown={this._keyDown}
          >{translate('All exploration related engineers')}</li>
        </ul>
        <hr/>
        <div className='select-group cap'>{translate('Role')}</div>
        <ul id={'role'}>
          <li className={cn({ active: this.state.DW2Role === 'exploration' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'exploration' })}
              onKeyDown={this._keyDown}
          >{translate('Exploration')}</li>
          <li className={cn({ active: this.state.DW2Role === 'surface' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'surface' })}
              onKeyDown={this._keyDown}
          >{translate('Surface exploration')}</li>
          <li className={cn({ active: this.state.DW2Role === 'fullmining' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'fullmining' })}
              onKeyDown={this._keyDown}
          >{translate('Big Rig, full mining')}</li>
          <li className={cn({ active: this.state.DW2Role === 'prospector' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'prospector' })}
              onKeyDown={this._keyDown}
          >{translate('Saper / Prospector mining')}</li>
          <li className={cn({ active: this.state.DW2Role === 'rat' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'rat' })} onKeyDown={this._keyDown}
          >{translate('Fuel rat')}</li>
          <li className={cn({ active: this.state.DW2Role === 'repair' }, 'lc')} tabIndex="0"
              onClick={() => this.setState({ DW2Role: 'repair' })} onKeyDown={this._keyDown}
          >{translate('Repair rat')}</li>
        </ul>
        <hr/>
        <ul>
        <li className={cn({ active: this.state.DW2Gfsb === true }, 'lc')}
        onClick={() => this.setState({ DW2Gfsb: this.state.DW2Gfsb === true ? false : true })}>
          Add Guardian FSD Booster
          </li>
        </ul>
        <ul>
        <li className={cn({ active: this.state.DW2Gpp === true }, 'lc')}
        onClick={() => this.setState({ DW2Gpp: this.state.DW2Gpp === true ? false : true })}>
          Add Guardian Power Plant
          </li>
        </ul>
        <ul>
        <li className={cn({ active: this.state.DW2Fighter === true }, 'lc')}
        onClick={() => this.setState({ DW2Fighter: this.state.DW2Fighter === true ? false : true })}>
          Add Fighter
          </li>
        </ul>
        <hr/>
        <ul>
          <li onClick={this._dw2} className={cn('lc')} tabIndex="0"
              onKeyDown={this._keyDown}>
            <button className="button">Apply</button>
          </li>
        </ul>
      </div>
    );
  }

  /**
   * Miner Build
   * @param  {Boolean} shielded True if shield generator should be included
   */
  _optimizeMiner(shielded) {
    this.selectedRefId = 'miner';
    ShipRoles.miner(this.props.ship, shielded);
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * Explorer role
   * @param  {Boolean} planetary True if Planetary Vehicle Hangar (PVH) should be included
   */
  _optimizeExplorer(planetary) {
    this.selectedRefId = 'explorer';
    if (planetary) this.selectedRefId = 'planetary';
    ShipRoles.explorer(this.props.ship, planetary);
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * Racer role
   */
  _optimizeRacer() {
    this.selectedRefId = 'racer';
    ShipRoles.racer(this.props.ship);
    this.props.onChange();
    this.props.onCargoChange(this.props.ship.cargoCapacity);
    this.props.onFuelChange(this.props.ship.fuelCapacity);
    this._close();
  }

  /**
   * Use the specified bulkhead
   * @param  {Object} bulkhead Bulkhead module details
   */
  _selectBulkhead(bulkhead) {
    this.props.ship.useBulkhead(bulkhead.index);
    this.context.tooltip();
    this.props.onChange();
    this._close();
  }

  /**
   * On right click optimize the standard modules
   */
  _contextMenu() {
    this._optimizeStandard();
  }

  /**
   * Generate the slot React Components
   * @return {Array} Array of Slots
   */
  _getSlots() {
    let { ship, currentMenu, cargo, fuel } = this.props;
    let slots = new Array(8);
    let open = this._openMenu;
    let select = this._selectModule;
    let st = ship.standard;
    let avail = ship.getAvailableModules().standard;
    let bh = ship.bulkheads;

    slots[0] = <StandardSlot
      key='bh'
      slot={bh}
      modules={ship.getAvailableModules().bulkheads}
      onOpen={open.bind(this, bh)}
      onSelect={this._selectBulkhead}
      selected={currentMenu == bh}
      onChange={this.props.onChange}
      ship={ship}
    />;

    slots[1] = <StandardSlot
      key='pp'
      slot={st[0]}
      modules={avail[0]}
      onOpen={open.bind(this, st[0])}
      onSelect={select.bind(this, st[0])}
      selected={currentMenu == st[0]}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m instanceof Module ? m.getPowerGeneration() < ship.powerRetracted : m.pgen < ship.powerRetracted}
    />;

    slots[2] = <StandardSlot
      key='th'
      slot={st[1]}
      modules={avail[1]}
      onOpen={open.bind(this, st[1])}
      onSelect={select.bind(this, st[1])}
      selected={currentMenu == st[1]}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m instanceof Module ? m.getMaxMass() < (ship.unladenMass + cargo + fuel - st[1].m.mass + m.mass) : m.maxmass < (ship.unladenMass + cargo + fuel - st[1].m.mass + m.mass)}
    />;


    slots[3] = <StandardSlot
      key='fsd'
      slot={st[2]}
      modules={avail[2]}
      onOpen={open.bind(this, st[2])}
      onSelect={select.bind(this, st[2])}
      onChange={this.props.onChange}
      ship={ship}
      selected={currentMenu == st[2]}
    />;

    slots[4] = <StandardSlot
      key='ls'
      slot={st[3]}
      modules={avail[3]}
      onOpen={open.bind(this, st[3])}
      onSelect={select.bind(this, st[3])}
      onChange={this.props.onChange}
      ship={ship}
      selected={currentMenu == st[3]}
    />;

    slots[5] = <StandardSlot
      key='pd'
      slot={st[4]}
      modules={avail[4]}
      onOpen={open.bind(this, st[4])}
      onSelect={select.bind(this, st[4])}
      selected={currentMenu == st[4]}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m instanceof Module ? m.getEnginesCapacity() <= ship.boostEnergy : m.engcap <= ship.boostEnergy}
    />;

    slots[6] = <StandardSlot
      key='ss'
      slot={st[5]}
      modules={avail[5]}
      onOpen={open.bind(this, st[5])}
      onSelect={select.bind(this, st[5])}
      selected={currentMenu == st[5]}
      onChange={this.props.onChange}
      ship={ship}
    />;

    slots[7] = <StandardSlot
      key='ft'
      slot={st[6]}
      modules={avail[6]}
      onOpen={open.bind(this, st[6])}
      onSelect={select.bind(this, st[6])}
      selected={currentMenu == st[6]}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m.fuel < st[2].m.maxfuel}  // Show warning when fuel tank is smaller than FSD Max Fuel
    />;

    return slots;
  }

  /**
   * Generate the section drop-down menu
   * @param  {Function} translate Translate function
   * @return {React.Component}    Section menu
   */
  _getSectionMenu(translate) {
    let planetaryDisabled = this.props.ship.internal.length < 4;
    if (this.state.showDW2 === true) {
      return this._showDW2Menu(translate);
    }
    return <div className='select' onClick={(e) => e.stopPropagation()} onContextMenu={stopCtxPropagation}>
      <ul>
        <li className='lc' tabIndex="0" onClick={this._optimizeStandard} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['maxjump'] = smRef}>{translate('Maximize Jump Range')}</li>
      </ul>
      <div className='select-group cap'>{translate('roles')}</div>
      <ul>
        <li className='lc' tabIndex="0" onClick={this._multiPurpose.bind(this, false, 0)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['multipurpose'] = smRef}>{translate('Multi-purpose')}</li>
        <li className='lc' tabIndex="0" onClick={this._multiPurpose.bind(this, true, 2)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['combat'] = smRef}>{translate('Combat')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeCargo.bind(this, true)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['trader'] = smRef}>{translate('Trader')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeExplorer.bind(this, false)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['explorer'] = smRef}>{translate('Explorer')}</li>
        <li className={cn('lc', { disabled: planetaryDisabled })} tabIndex={planetaryDisabled ? '' : '0'}
            onClick={!planetaryDisabled && this._optimizeExplorer.bind(this, true)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['planetary'] = smRef}>{translate('Planetary Explorer')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeMiner.bind(this, true)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['miner'] = smRef}>{translate('Miner')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeRacer.bind(this)} onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['racer'] = smRef}>{translate('Racer')}</li>
        <li className='lc' tabIndex="0" onClick={() => this.setState({ showDW2: !this.state.showDW2 })}
            onKeyDown={this._keyDown}
            ref={smRef => this.sectionRefArr['dw2'] = smRef}>{translate('DW2')}</li>
      </ul>
    </div>;
  }

}
