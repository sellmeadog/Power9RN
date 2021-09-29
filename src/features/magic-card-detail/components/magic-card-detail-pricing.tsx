import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';

import { gql, useQuery } from '@apollo/client';

import { P9CaptionText, P9TableTitleDivider, P9ViewSurface } from '../../../components';
import { usePower9Theme } from '../../../core/theme';

export interface P9MagicCardDetailPricingProps {
  containerStyle?: StyleProp<ViewStyle>;
  id?: string;
}

interface P9MagicCardPriceQueryResponse {
  price: {
    id: string;
    normal?: string;
    foil?: string;
    tix?: string;
  };
}

const GET_CARD_PRICE_SUMMARY = gql`
  query CardPricing($id: String!) {
    price(id: $id) {
      id
      normal
      foil
      tix
    }
  }
`;

export const P9MagicCardDetailPricing: FunctionComponent<P9MagicCardDetailPricingProps> = ({ containerStyle, id }) => {
  const { data } = useQuery<P9MagicCardPriceQueryResponse>(GET_CARD_PRICE_SUMMARY, {
    variables: { id },
  });

  return (
    <P9ViewSurface style={[containerStyle]}>
      <P9TableTitleDivider>{'Pricing'}</P9TableTitleDivider>
      <View style={P9MagicCardDetailPricingTheme.sectionContainer}>
        <P9MagicCardPrice title={'normal'} price={data?.price?.normal} />
        <P9MagicCardPrice title={'foil'} price={data?.price?.foil} />
        <P9MagicCardPrice title={'mtgo'} price={data?.price?.tix} />
      </View>
    </P9ViewSurface>
  );
};

interface P9MagicCardPriceProps {
  title: 'normal' | 'foil' | 'mtgo';
  price?: string;
}

const P9MagicCardPrice: FunctionComponent<P9MagicCardPriceProps> = ({ title, price }) => {
  const [{ colors }] = usePower9Theme();

  return (
    <P9ViewSurface style={P9MagicCardDetailPricingTheme.priceContainer}>
      <View style={P9MagicCardDetailPricingTheme.priceValueContainer}>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[{ color: colors?.teal }, P9MagicCardDetailPricingTheme.priceValue]}
        >
          {price || '-'}
        </Text>
      </View>
      <P9CaptionText style={[P9MagicCardDetailPricingTheme.priceTitle]}>{title}</P9CaptionText>
    </P9ViewSurface>
  );
};

const P9MagicCardDetailPricingTheme = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  priceContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  priceTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
  },

  priceValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceValue: {
    fontSize: 34,
  },
});
