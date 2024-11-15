import { gsap } from "gsap";
import { getBillData }  from "../store/solarSizingState";
import { BillPreview } from "./BillPreview";

export class BillReviewPage {
  constructor() {
    this.billData = getBillData();
    this.billPreview = new BillPreview();
  }

  render() {
    const billData = getBillData();
    this.billPreview.render(billData);
  }
}