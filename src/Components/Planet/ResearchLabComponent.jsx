import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';

import ExchangeRate from '../../Libs/BonVoyage/ExchangeRate';
import ResearchLabItemComponent from './ResearchLab/ResearchLabItemComponent';

import Fleet from '../../Libs/BonVoyage/Model/Fleet';

@observer
class ResearchLabComponent extends Component {

    @observable validating = false;
    @observable success = false;

    validResearchLabTechs = Fleet.validResearchLabTechs;
    
    render() {
        
        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Research Lab</h4>
                <p>You can borrow some of our technologies, for a price.</p>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                    <tr>
                        {this.validResearchLabTechs.map((x, i) =>
                            <ResearchLabItemComponent store={this.props.store} tryToPurchaseItem={this.tryToPurchaseItem}
                                                   key={'researchLabInput-'+x}
                                                   techData={this.props.priceList[x]} techId={x} />
                        )}
                    </tr>
                    </tbody>
                </table>
                <div>
                    <span className={this.success?'text-success':'hidden'}>Thanks for buying!</span>
                    <span className={this.validating?'text-error':'hidden'}>Not enough Space Credits!</span>
                </div>
            </div>
        );
    }

    tryToPurchaseItem = (idx) => {

        const basePrice = ExchangeRate.resourcesToSpaceCredits(this.props.priceList[idx], ExchangeRate.NORMAL);

        this.validating = false;
        this.success = false;
        
        const price = ResearchLabItemComponent.calcPrice(
            basePrice,
            this.props.priceList[idx].factor,
            this.props.store.playerFleet.techs[idx]+1);
        if(price > this.props.store.playerFleet.spaceCredits){
            this.validating = true;
        } else {
            this.props.store.playerFleet.techs[idx] += 1;
            this.props.store.playerFleet.spaceCredits -= price;

            this.success = true;
        }

        setTimeout(() => {
            this.validating = false;
            this.success = false;
        }, 3000);
  

    };
    
    

}

export default ResearchLabComponent;