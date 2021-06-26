import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { ID } from '@datorama/akita';

import { P9CarouselToggleButton, P9ItemSeparator } from '../../../../components';
import { P9ComparisonOperator, P9LogicalOperator, P9Predicate } from '../../model';
import { P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';

export interface P9GameplayStatePredicateEditorProps {
  predicate: P9Predicate<number>;
  onUpdate?: (id: ID, patch: Partial<P9Predicate<number>>) => void;
  onRemove?: (id: ID) => void;
}

export const P9GameplayStatePredicateEditor: FunctionComponent<P9GameplayStatePredicateEditorProps> = ({
  predicate,
  onUpdate,
  onRemove,
}) => {
  const title = useMemo(() => {
    switch (predicate.attribute) {
      case 'cmc':
        return 'mana value';

      case 'card_faces.power_numeric':
        return 'power';

      case 'card_faces.toughness_numeric':
        return 'toughness';

      case 'card_faces.loyalty_numeric':
        return 'loyalty';

      default:
        return '';
    }
  }, [predicate.attribute]);

  const handleComparisonOperatorChange = (comparisonOperator: P9ComparisonOperator) => {
    onUpdate?.(predicate.id, { comparisonOperator });
  };

  const handleLogicalOperatorChange = (logicalOperator: P9LogicalOperator) => {
    onUpdate?.(predicate.id, { logicalOperator });
  };

  const handleRemove = () => {
    onRemove?.(predicate.id);
  };

  return (
    <>
      <P9ItemSeparator marginLeft={15} />
      <View style={P9GameplayStatePredicateEditorTheme.container}>
        <P9LogicalOperatorToggle onChange={handleLogicalOperatorChange} value={predicate?.logicalOperator} />
        <Text style={[P9GameplayStatePredicateEditorTheme.attribute, P9GameplayStatePredicateEditorTheme.text]}>
          {title}
        </Text>
        <P9CarouselToggleButton
          options={[
            { value: P9ComparisonOperator.Equal, title: 'equals' },
            { value: P9ComparisonOperator.GreaterThan, title: 'greater than' },
            { value: P9ComparisonOperator.LessThan, title: 'less than' },
          ]}
          onToggle={handleComparisonOperatorChange}
          titleStyle={[P9GameplayStatePredicateEditorTheme.text]}
          value={predicate?.comparisonOperator}
        />
        <Text style={[P9GameplayStatePredicateEditorTheme.expression, P9GameplayStatePredicateEditorTheme.text]}>
          {predicate?.expression}
        </Text>
        <Icon name={'minus-circle-outline'} type={'material-community'} size={15} onPress={handleRemove} />
      </View>
    </>
  );
};

const P9GameplayStatePredicateEditorTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    height: 44,
  },

  attribute: {
    fontWeight: '500',
    paddingRight: 8,
  },

  expression: {
    flex: 1,
    paddingHorizontal: 8,
  },

  text: {
    fontSize: 17,
  },
});
