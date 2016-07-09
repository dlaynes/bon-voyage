import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';

import ExchangeRate from '../../Libs/BonVoyage/ExchangeRate';
import ResearchLabItemComponent from './ResearchLab/ResearchLabItemComponent';

@observer
class ResearchLabComponent extends Component {

    timeout = null;

    @observable validating = false;
    @observable success = false;
    
    render() {
        
        let validResearchLabTechs = this.props.store.validResearchLabTechs;
        
        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Research Lab</h4>
                <p>You can borrow some of our technologies, for a price.</p>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                    <tr>
                        {validResearchLabTechs.map((x, i) =>
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
        
        const price = ResearchLabItemComponent.calcPrice(
            basePrice,
            this.props.priceList[idx].factor,
            this.props.store.techs[idx]+1);
        if(price > this.props.store.spaceCredits){
            this.validating = true;
            this.success = false;
        } else {
            this.props.store.techs[idx] += 1;
            this.props.store.spaceCredits -= price;
            this.validating = false;
            this.success = true;
        }

        if(!this.timeout){
            this.timeout = setTimeout(() => {
                this.validating = false;
                this.success = false;
                this.timeout = null;
            }, 3000);
        }

    };
    
    

}

export default ResearchLabComponent;