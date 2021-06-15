import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/core';

import { usePower9Theme } from '../../../../core/theme';
import { P9LogicalOperator } from '../../model/predicate';
import { P9PickerPredicateEditor } from './picker-predicate-editor.component';
import { usePickerPredicateEditor } from './picker-predicate.facade';

export type P9PredicateBuilderNavigationParams = {
  route: string;
  title: string;
};

export interface P9PickerPredicateBuilderProps {
  attribute: string;
  placeholder: string;
  navigationParams: P9PredicateBuilderNavigationParams;
}

export const P9PickerPredicateBuilder: FunctionComponent<P9PickerPredicateBuilderProps> = ({
  attribute,
  placeholder,
  navigationParams: { route, title },
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
    (id: string, logicalOperator: P9LogicalOperator) => update(id, { logicalOperator }),
    [update],
  );

  const handlePress = useCallback(() => navigate(route, { attribute, title }), [attribute, navigate, route, title]);

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (animated.value = colors!.grey0!)}
        onPressOut={() => (animated.value = colors!.background!)}>
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
