import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/core';

import { usePower9Theme } from '../../../../core/theme';
import { P9ComparisonOperator, P9LogicalOperator, P9StringOperator } from '../../model/predicate';
import { P9PickerPredicateEditor } from './picker-predicate-editor.component';
import { usePickerPredicateEditor } from './picker-predicate.facade';

export type P9PredicateBuilderNavigationParams = {
  comparisonOperator?: P9ComparisonOperator;
  logicalOperator?: P9LogicalOperator;
  route: string;
  stringOperator?: P9StringOperator;
  title: string;
};

export interface P9PickerPredicateBuilderProps {
  attribute: string;
  comparisonOperator?: P9ComparisonOperator;
  logicalOperator?: P9LogicalOperator;
  navigationParams?: P9PredicateBuilderNavigationParams;
  placeholder: string;
  stringOperator?: P9StringOperator;
  navigationRoute: string;
  navigationTitle: string;
}

export const P9PickerPredicateBuilder: FunctionComponent<P9PickerPredicateBuilderProps> = ({
  attribute,
  comparisonOperator,
  logicalOperator,
  navigationRoute,
  navigationTitle,
  placeholder,
  stringOperator,
}) => {
  const { navigate } = useNavigation();
  const [{ colors }] = usePower9Theme();
  const [predicates, update, remove] = usePickerPredicateEditor(attribute);
  const animated = useSharedValue(colors!.background!);

  const pressedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(animated.value, { duration: 100 }),
    };
  });

  const handleLogicalOperatorToggle = useCallback(
    (id: string, value: P9LogicalOperator) => update(id, { logicalOperator: value }),
    [update],
  );

  const handlePress = useCallback(
    () =>
      navigate(navigationRoute, {
        attribute,
        comparisonOperator,
        logicalOperator,
        stringOperator,
        title: navigationTitle,
      }),
    [attribute, comparisonOperator, logicalOperator, navigate, navigationRoute, navigationTitle, stringOperator],
  );

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (animated.value = colors!.grey0!)}
        onPressOut={() => (animated.value = colors!.background!)}
      >
        <Animated.View style={[P9PickerPredicateBuilderTheme.pressable, pressedStyle]}>
          <Text>{placeholder}</Text>
          <Icon name={'arrow-forward-ios'} />
        </Animated.View>
      </Pressable>
      {predicates?.map((predicate, index) => (
        <P9PickerPredicateEditor
          key={index}
          id={predicate.id}
          predicate={predicate}
          remove={remove}
          onLogicalOperatorToggle={handleLogicalOperatorToggle}
        />
      ))}
    </>
  );
};

const P9PickerPredicateBuilderTheme = StyleSheet.create({
  pressable: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
