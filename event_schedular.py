from datetime import datetime, timedelta

# Function to parse time in HH:MM format
def parse_time(time_str):
    return datetime.strptime(time_str, "%H:%M")

# Function to format time back to HH:MM format
def format_time(time_obj):
    return time_obj.strftime("%H:%M")

# Event class to hold event details
class Event:
    def __init__(self, description, start_time, end_time):
        self.description = description
        self.start_time = parse_time(start_time)
        self.end_time = parse_time(end_time)

    def __repr__(self):
        return f'"{self.description}", Start: "{format_time(self.start_time)}", End: "{format_time(self.end_time)}"'

# Function to detect conflicts and suggest resolutions
def detect_conflicts_and_suggest_resolutions(events):
    sorted_events = sorted(events, key=lambda e: e.start_time)
    conflicts = []
    resolutions = []

    for i in range(len(sorted_events) - 1):
        current_event = sorted_events[i]
        next_event = sorted_events[i + 1]

        if current_event.end_time > next_event.start_time:
            conflicts.append((current_event, next_event))
            # Suggest resolution by moving the next event after the current event
            suggested_start = current_event.end_time
            suggested_end = suggested_start + (next_event.end_time - next_event.start_time)
            resolutions.append((next_event.description, suggested_start, suggested_end))

    return sorted_events, conflicts, resolutions

# Function to get user input for events
def get_user_input():
    events = []
    num_events = int(input("Enter the number of events: "))
    for i in range(num_events):
        description = input(f"Enter description for event {i + 1}: ")
        start_time = input(f"Enter start time for event {i + 1} (HH:MM): ")
        end_time = input(f"Enter end time for event {i + 1} (HH:MM): ")
        events.append(Event(description, start_time, end_time))
    return events

# Main function to run the scheduler
def main():
    events = get_user_input()
    sorted_schedule, conflicting_events, suggested_resolutions = detect_conflicts_and_suggest_resolutions(events)

    print("\nSorted Schedule:")
    for event in sorted_schedule:
        print(event)

    print("\nConflicting Events:")
    for conflict in conflicting_events:
        print(conflict)

    print("\nSuggested Resolutions:")
    for resolution in suggested_resolutions:
        print(f'Reschedule "{resolution[0]}" to Start: "{format_time(resolution[1])}", End: "{format_time(resolution[2])}"')

# Run the main function
if __name__ == "__main__":
    main()
