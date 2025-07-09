import type React from 'react';
import { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

interface FormPagerProps {
  steps: React.ReactNode[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const FormPager: React.FC<FormPagerProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    // Simple page change without complex animations
    if (pagerRef.current) {
      pagerRef.current.setPage(currentStep);
    }
  }, [currentStep]);

  const handlePageSelected = (e: any) => {
    const newStep = e.nativeEvent.position;
    if (newStep !== currentStep) {
      onStepChange(newStep);
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={false}
        overdrag={false}
      >
        {steps.map((step, index) => (
          <View key={index} style={styles.page}>
            {step}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    // paddingHorizontal: 16,
  },
});
