import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    balcony: {
      type: Boolean,
      default: false,
    },
    outdoorKitchen: {
      type: Boolean,
      default: false,
    },
    cableTv: {
      type: Boolean,
      default: false,
    },
    deck: {
      type: Boolean,
      default: false,
    },
    tennisCourts: {
      type: Boolean,
      default: false,
    },
    internet: {
      type: Boolean,
      default: false,
    },
    sunRoom: {
      type: Boolean,
      default: false,
    },
    concreteFlooring: {
      type: Boolean,
      default: false,
    },
    userRef: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
