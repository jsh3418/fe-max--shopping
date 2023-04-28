import { BASE_URL } from "../../../constants/BASE_URL";
import { fetchData } from "../../../utils/fetchData";
import { HeroSectionModel } from "./heroSectionModel";
import { IntervalIdStateManager } from "./types";

export class HeroSectionPresenter {
  private model: HeroSectionModel;

  constructor(model: HeroSectionModel) {
    this.model = model;
  }

  fetchImages() {
    const url = new URL("/hero_image", BASE_URL);

    return fetchData(url).then((images) => {
      this.model.setImages(images);

      return images;
    });
  }

  getImages() {
    return this.model.getImages();
  }

  async moveToPrevImage($imageContainer: HTMLElement) {
    this.model.decreaseViewIndex();

    if (this.model.isUnderflowImageIndex()) {
      this.model.setLastViewIndex();
      await this.handleIndexUnderflow($imageContainer);
    }

    const viewIndex = this.model.getViewIndex();

    this.moveImageList(viewIndex, $imageContainer);
    this.resetIntervalImageMove($imageContainer);
  }

  async moveToNextImage($imageContainer: HTMLElement) {
    this.model.increaseViewIndex();

    if (this.model.isOverflowImageIndex()) {
      this.model.setFisrtViewIndex();
      await this.handleIndexOverflow($imageContainer);
    }

    const viewIndex = this.model.getViewIndex();

    this.moveImageList(viewIndex, $imageContainer);
    this.resetIntervalImageMove($imageContainer);
  }

  async handleIndexUnderflow($imageContainer: HTMLElement) {
    if ($imageContainer.firstElementChild == null) {
      throw new Error("The image container is empty.");
    }

    const imageCount = this.model.getImageCount();

    $imageContainer.insertAdjacentElement("beforeend", $imageContainer.firstElementChild);
    $imageContainer.style.transitionDuration = "";
    $imageContainer.style.transform = `translateX(-${imageCount - 1}00%)`;

    await this.delay(1);
  }

  async handleIndexOverflow($imageContainer: HTMLElement) {
    if ($imageContainer.lastElementChild == null) {
      throw new Error("The image container is empty.");
    }

    $imageContainer.insertAdjacentElement("afterbegin", $imageContainer.lastElementChild);

    $imageContainer.style.transitionDuration = "";
    $imageContainer.style.transform = `translateX(0%)`;

    await this.delay(1);
  }

  moveImageList(index: number, $imageContainer: HTMLElement) {
    $imageContainer.style.transitionDuration = "500ms";
    $imageContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setIntervalImageMove($imageContainer: HTMLElement) {
    const id = setInterval(() => this.moveToNextImage($imageContainer), 10000);

    this.model.setIntervalId(id);
  }

  resetIntervalImageMove($imageContainer: HTMLElement) {
    const intervalId = this.model.getIntervalId();

    clearInterval(intervalId);
    this.setIntervalImageMove($imageContainer);
  }

  createIntervalIdStateManager = (): IntervalIdStateManager => {
    let intervalId = 0;
    return {
      setIntervalId(id: number) {
        intervalId = id;
      },

      getIntervalId() {
        return intervalId;
      },
    };
  };
}